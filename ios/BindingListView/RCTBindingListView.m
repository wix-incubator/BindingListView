#import "RCTBindingListView.h"
#import "RCTBindingCell.h"
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTUtils.h>
#import <React/UIView+React.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

//@interface RCTUIManager (BindingListView)
//
//- (void)updateView:(NSNumber *)reactTag viewName:(NSString *)viewName props:(NSDictionary *)props;
//
//@end

@implementation RCTBindingListView

RCTBridge *_bridge;
UITableView *_tableView;
RCTUIManager *_uiManager;
NSMutableArray *_unusedCells;

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  RCTAssertParam(bridge);
  
  if ((self = [super initWithFrame:CGRectZero]))
  {
    _bridge = bridge;
    while ([_bridge respondsToSelector:NSSelectorFromString(@"parentBridge")]
           && [_bridge valueForKey:@"parentBridge"])
    {
      _bridge = [_bridge valueForKey:@"parentBridge"];
    }
    _uiManager = _bridge.uiManager;
    _unusedCells = [NSMutableArray array];
    [self createTableView];
  }
  
  return self;
}

RCT_NOT_IMPLEMENTED(-initWithFrame:(CGRect)frame)
RCT_NOT_IMPLEMENTED(-initWithCoder:(NSCoder *)aDecoder)

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
  [_unusedCells addObject:subview];
}

- (void)layoutSubviews
{
  [_tableView setFrame:self.frame];
}

- (void)createTableView
{
  _tableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
  _tableView.dataSource = self;
  _tableView.delegate = self;
  _tableView.backgroundColor = [UIColor whiteColor];
  [self addSubview:_tableView];
}

- (void)setRowHeight:(float)rowHeight
{
  _tableView.estimatedRowHeight = rowHeight;
  _rowHeight = rowHeight;
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)theTableView
{
  return 1;
}

- (NSInteger)tableView:(UITableView *)theTableView numberOfRowsInSection:(NSInteger)section
{
  return self.numRows;
}

- (RCTBindingCell*)getUnusedCellFromPool
{
  RCTBindingCell* res = [_unusedCells lastObject];
  [_unusedCells removeLastObject];
  if (res != nil)
  {
    res.tag = [_unusedCells count];
  }
  if (res == nil)
  {
    NSLog(@"BindingListView Error: Not enough cells, increase poolSize");
  }
  return res;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
  return self.rowHeight;
}

- (UITableViewCell *)tableView:(UITableView *)theTableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
  RCTBindingCell *cell = (RCTBindingCell *)[theTableView dequeueReusableCellWithIdentifier:[RCTBindingCell getCellIdentifier]];
  if (cell == nil)
  {
    //NSLog(@"Allocating childIndex %d for row %d", (int)cell.cellView.tag, (int)indexPath.row);
    cell = [self getUnusedCellFromPool];
  }
  else
  {
    //NSLog(@"Recycling childIndex %d for row %d", (int)cell.cellView.tag, (int)indexPath.row);
  }
  
  NSDictionary *row = [self.rows objectAtIndex:indexPath.row];
    
  for (NSString *bindingId in self.binding)
  {
    NSString *rowKey = [self.binding objectForKey:bindingId];
    NSDictionary *binding = [cell.bindings objectForKey:bindingId];
    if (!binding) continue;
    NSNumber *reactTag = [binding objectForKey:@"tag"];
    NSString *viewName = [binding objectForKey:@"viewName"];
    NSString *prop = [binding objectForKey:@"prop"];
    NSString *rowValue = [row objectForKey:rowKey];
    if ([prop isEqualToString:@"children"])
    {
      dispatch_async(RCTGetUIManagerQueue(), ^{
        [_uiManager updateView:reactTag viewName:@"RCTRawText" props:@{@"text": rowValue}];
        [_uiManager batchDidComplete];
      });
    }
    else
    {
      [_uiManager synchronouslyUpdateViewOnUIThread:reactTag viewName:viewName props:@{prop: rowValue}];
    }
  }
  
  return cell;
}

@end

#import "RCTBindingListView.h"
#import "RCTBindingCell.h"
#import <React/RCTConvert.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTUtils.h>
#import <React/UIView+React.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

@interface RCTUIManager (BindingListView)

- (void)updateView:(NSNumber *)reactTag viewName:(NSString *)viewName props:(NSDictionary *)props;

@end

@implementation RCTBindingListView {
  RCTBridge *_bridge;
  UITableView *_tableView;
  RCTUIManager *_uiManager;
  NSMutableArray *_unusedCells;
  RCTBindingCell *_cellForHeightMeasurement;
  NSMutableDictionary *_cellsHeights;
}

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
    
    _cellsHeights = @{}.mutableCopy;
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
  return [self _measureHeightOfRowAtIndex:indexPath.row];
}

- (CGFloat)_measureHeightOfRowAtIndex:(NSUInteger)rowIndex
{
  NSNumber *calculatedHeight = _cellsHeights[@(rowIndex)];
  if(calculatedHeight) {
    return calculatedHeight.floatValue;
  }
  
  if(!_cellForHeightMeasurement) {
    _cellForHeightMeasurement = [self getUnusedCellFromPool];;
  }

  [self _bindCell:_cellForHeightMeasurement toRowIndex:rowIndex];

  CGFloat result = [_cellForHeightMeasurement reactContentHeight];
  _cellsHeights[@(rowIndex)] = @(result);
  return result;
}

- (UITableViewCell *)tableView:(UITableView *)theTableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
  RCTBindingCell *cell = (RCTBindingCell *)[theTableView dequeueReusableCellWithIdentifier:[RCTBindingCell getCellIdentifier]];
  if (cell == nil)
  {
    //NSLog(@"Allocating childIndex %d for row %d", (int)cell.cellView.tag, (int)indexPath.row);
    cell = [self getUnusedCellFromPool];
  }

  if(cell == nil)
  {
    //NSLog(@"Recycling childIndex %d for row %d", (int)cell.cellView.tag, (int)indexPath.row);
    UITableViewCell *c = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"polyfill"];
    c.contentView.backgroundColor = [UIColor magentaColor];
    return c;
  }

  [self _bindCell:cell toRowIndex:indexPath.row];

  return cell;
}

- (void)_bindCell:(RCTBindingCell *)cell toRowIndex:(NSUInteger)rowIndex
{
  NSDictionary *row = [self.rows objectAtIndex:rowIndex];
  
  [self _workaroundForCellsCenterChange_save];
  
  dispatch_sync(RCTGetUIManagerQueue(), ^{
    for (NSString *bindingId in self.binding)
    {
      NSString *rowKey = [self.binding objectForKey:bindingId];
      NSDictionary *binding = [cell.bindings objectForKey:bindingId];
      if (!binding) continue;
      NSNumber *reactTag = [binding objectForKey:@"tag"];
      NSString *viewName = [binding objectForKey:@"viewName"];
      NSString *prop = [binding objectForKey:@"prop"];
      NSString *rowValue = [row objectForKey:rowKey];
      [_uiManager updateView:reactTag viewName:viewName props:@{prop: rowValue}];
    }
    
    // The following line of code (and some others) requires UIManager patch, execute the following in a terminal:
    //     patch -p0 < uimanager_sync_update.patch
    // (It's obviously bad, but it's just an experiment..)
    ShouldSetFlushingBlockToGlobalVarInsteadOfWaitingForMainQueue = YES;
    
    [_uiManager batchDidComplete];
  });
  
  if(FlusingBlockThatHasToBeRunOnMainQueue) {
    FlusingBlockThatHasToBeRunOnMainQueue();
    FlusingBlockThatHasToBeRunOnMainQueue = nil;
  }
  
  [self _workaroundForCellsCenterChange_restore];
}

// For some reason, yoga changes the centers of the cells. Using a workaround for now:
static NSDictionary *_workaroundForCellsCenterChange_centers;
- (void)_workaroundForCellsCenterChange_save
{
  NSMutableDictionary *centers = @{}.mutableCopy;
  for(UIView *v in _tableView.visibleCells) {
    NSValue *p = [NSValue valueWithPointer:(__bridge const void * _Nullable)(v)];
    centers[p] = [NSValue valueWithCGPoint:v.center];
  }
  _workaroundForCellsCenterChange_centers = centers.copy;
}
- (void)_workaroundForCellsCenterChange_restore
{
  for(UIView *v in _tableView.visibleCells) {
    NSValue *p = [NSValue valueWithPointer:(__bridge const void * _Nullable)(v)];
    NSValue *centerValue = _workaroundForCellsCenterChange_centers[p];
    if(centerValue) {
      v.center = centerValue.CGPointValue;;
    }
  }
  _workaroundForCellsCenterChange_centers = nil;
}

@end

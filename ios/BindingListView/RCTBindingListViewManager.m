#import "RCTBindingListViewManager.h"
#import "RCTBindingListView.h"

@implementation RCTBindingListViewManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[RCTBindingListView alloc] initWithBridge:self.bridge];
}

RCT_EXPORT_VIEW_PROPERTY(rowHeight, float)
RCT_EXPORT_VIEW_PROPERTY(numRows, NSInteger)
RCT_EXPORT_VIEW_PROPERTY(binding, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(rows, NSArray)

@end

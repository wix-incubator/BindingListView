#import "RCTBindingCellManager.h"
#import "RCTBindingCell.h"

@implementation RCTBindingCellManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [[RCTBindingCell alloc] init];
}

RCT_EXPORT_VIEW_PROPERTY(bindings, NSDictionary)

@end

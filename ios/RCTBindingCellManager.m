#import "RCTBindingCellManager.h"
#import "RCTBindingCell.h"

@implementation RCTBindingCellManager

RCT_EXPORT_MODULE()

- (UITableViewCell *)view
{
  return [[RCTBindingCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:[RCTBindingCell getCellIdentifier]];
}

RCT_EXPORT_VIEW_PROPERTY(bindings, NSDictionary)

@end

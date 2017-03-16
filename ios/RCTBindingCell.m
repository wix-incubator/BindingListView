#import "RCTBindingCell.h"
#import <React/UIView+React.h>

@implementation RCTBindingCell

+(NSString*)getCellIdentifier
{
  static NSString *cellIdentifier = @"CustomCell";
  return cellIdentifier;
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
  [self.contentView addSubview:subview];
}

@end

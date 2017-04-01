#import "RCTBindingCell.h"
#import <React/UIView+React.h>

@implementation RCTBindingCell {
  UIView *_rctView;
}

+ (NSString*)getCellIdentifier
{
  static NSString *cellIdentifier = @"CustomCell";
  return cellIdentifier;
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex
{
  _rctView = subview;
  [self.contentView addSubview:subview];
}

- (CGFloat)reactContentHeight
{
  return _rctView.frame.size.height;
}

@end

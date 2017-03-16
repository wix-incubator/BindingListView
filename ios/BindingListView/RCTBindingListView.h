#import <UIKit/UIKit.h>
@class RCTBridge;

@interface RCTBindingListView : UIView<UITableViewDataSource, UITableViewDelegate>

- (instancetype)initWithBridge:(RCTBridge *)bridge NS_DESIGNATED_INITIALIZER;

@property (nonatomic) float rowHeight;
@property (nonatomic) NSInteger numRows;
@property (nonatomic) NSDictionary<NSString*, NSString*> *binding;
@property (nonatomic) NSArray *rows;

@end

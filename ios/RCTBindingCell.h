#import <UIKit/UIKit.h>

@interface RCTBindingCell : UITableViewCell

+ (NSString*)getCellIdentifier;

@property (nonatomic) NSDictionary<NSString*, NSDictionary*> *bindings;

@end

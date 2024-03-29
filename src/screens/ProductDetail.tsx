import React, { Component } from 'react';

import { Platform, View } from 'react-native';
import { dataSource } from '../lib/datasource';
import { NavButton, NavigatorStyle, ScreenProps } from '../lib/commonTypes';
import { backButton } from '../lib/navStyles';
import { navBarDefault, navBarProductDetail } from '../styles/Navigation';
import { PSProductDetail } from '../components/PSProductDetail';
import { CombinedStore } from '../reducers';
import { connect } from 'react-redux';

// import withAccount, { AccountProps } from '../providers/accountProvider';
// import withRecentlyViewed, {
//   RecentlyViewedProps
// } from '../providers/recentlyViewedProvider';

// Seeing an Android issue in which if the user clicks on one of the PDP tabs and then goes
// back, the back buttons are invisible. Until we can investigate deeper we'll just make
// the PDP have a dark header. -BW
const NAVIGATOR_STYLE = Platform.OS === 'android' ? navBarDefault : navBarProductDetail;

export interface ProductDetailProps extends ScreenProps, Pick<CombinedStore, 'promoProducts'> {
  productId: string; // passed by Navigator
  renderShareIcon?: () => React.ReactNode;
}

export class UnwrappedProductDetail extends Component<ProductDetailProps> {
  static navigatorStyle: NavigatorStyle = NAVIGATOR_STYLE;
  static leftButtons: NavButton[] = [backButton];

  onOpenHTMLView = (html: string, title?: string) => {
    this.props.navigator.push({
      screen: 'DesktopPassthrough',
      title,
      passProps: {
        html
      }
    });
  }

  render(): JSX.Element {
    const { navigator, productId } = this.props;

    return (
      <View style={{flex: 1}}>
        <PSProductDetail
          id={productId}
          commerceDataSource={dataSource}
          commerceToReviewMap={'id'}
          navigator={navigator}
          onOpenHTMLView={this.onOpenHTMLView}
          promoProducts={this.props.promoProducts}
          // addToRecentlyViewed={this.props.addToRecentlyViewed}
          // recentlyViewed={this.props.recentlyViewed}
          // loadRecentlyViewed={this.props.loadRecentlyViewed}
        />
      </View>
    );
  }

  doesProductExist = (items: any[], productId: string) => {
    return items && items.findIndex(product => product.id === productId) > -1;
  }

  goBack = () => {
    this.props.navigator.pop();
  }
}

const mapStateToProps = (combinedStore: CombinedStore, ownProps: any) => {
  return {
    promoProducts: combinedStore.promoProducts
  };
};

export default connect(mapStateToProps)(UnwrappedProductDetail);

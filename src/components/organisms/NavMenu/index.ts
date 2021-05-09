import { withRouter } from 'react-router-dom';

import NavMenu from './NavMenu';
import { connector } from './NavMenu.types';

export default withRouter(connector(NavMenu));

export { NavMenu as _NavMenu };
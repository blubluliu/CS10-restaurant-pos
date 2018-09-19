import React from 'react';
import PropTypes from 'prop-types';

import { sidebar } from '../../config/conditionalPathnames';
import TableEditPanel from '../TableEditPanel';

import * as s from './styles';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.props.saveSidebarRef(this.ref);
  }

  render() {
    const { pathname } = this.props.location;
    return (
      <s.Sidebar
        innerRef={this.ref}
        modalIsOpen={this.props.modalIsOpen}
        visible={!sidebar.includes(pathname)}
      >
        <s.LinkGroup>
          <s.StyledLink to="/tables">Tables</s.StyledLink>
          <s.StyledLink to="/servers">Servers</s.StyledLink>
          <TableEditPanel push={this.props.history.push} />
        </s.LinkGroup>
        <s.LinkGroup>
          <s.StyledLink to="/settings">Settings</s.StyledLink>
          <s.StyledLink to="/help">Help</s.StyledLink>
        </s.LinkGroup>
      </s.Sidebar>
    );
  }
}

Sidebar.propTypes = {
  modalIsOpen: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  saveSidebarRef: PropTypes.func
};

Sidebar.defaultProps = {
  modalIsOpen: false,
  location: {},
  history: { push: () => {} },
  saveSidebarRef: () => {}
};

export default Sidebar;
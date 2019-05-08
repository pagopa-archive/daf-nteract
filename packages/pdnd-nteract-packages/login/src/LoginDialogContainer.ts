import { connect } from "react-redux";

import { loggedUserMetaSelector, requestLogin } from "../duck/loginDuck";
import LoginDialog from "./LoginDialog";

const LoginDialogContainer = connect(
  state => ({ ...loggedUserMetaSelector(state) }), // mapStateToProps,
  { requestLogin } // mapDispatchToProps
)(LoginDialog);

export default LoginDialogContainer;

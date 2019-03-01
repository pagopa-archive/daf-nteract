import React, { Fragment, FunctionComponent, SyntheticEvent } from "react";
import { connect } from "react-redux";
import { Icon, Intent, Button } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import { resetLogin } from "../duck/loginDuck";
import { LogoutButtonProps } from "../types";
import LoginDialogContainer from "./LoginDialogContainer";

const LogoutButton: FunctionComponent<LogoutButtonProps> = ({ resetLogin }) => {
  const handleLogout = (e: SyntheticEvent) => resetLogin();
  return (
    <Fragment>
      <LoginDialogContainer />
      <Button
        intent={Intent.PRIMARY}
        icon={<Icon className="bp3-dark" icon={IconNames.LOG_OUT} />}
        onClick={handleLogout}
      />
    </Fragment>
  );
};

const LogoutButtonContainer = connect(
  null, // mapStateToProps,
  { resetLogin } // mapDispatchToProps
)(LogoutButton);

export default LogoutButtonContainer;

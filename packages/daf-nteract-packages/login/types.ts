interface LoginDialogProps {
  loggedUser: {
    token: string;
  };
  isLoading: boolean;
  hasLoaded: boolean;
  error: boolean;
  requestLogin: Function;
}

interface PasswordInputProps {
  error: boolean;
}

interface PasswordInputState {
  isShown: boolean;
}

interface LogoutButtonProps {
  resetLogin: Function;
}

export {
  LoginDialogProps,
  PasswordInputProps,
  PasswordInputState,
  LogoutButtonProps
};

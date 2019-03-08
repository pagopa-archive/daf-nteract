interface ILoginDialogProps {
  isOpen: boolean;
  onClose: Function;
  loggedUser: {
    token: string;
  };
  isLoading: boolean;
  hasLoaded: boolean;
  error: boolean;
  requestLogin: Function;
}
interface IPasswordInputProps {
  error: boolean;
}

interface IPasswordInputState {
  isShown: boolean;
}

interface ILoginLogoutButtonProps {
  username?: string;
  isUserLogged: boolean;
  resetLogin: Function;
}

interface ILoginLogoutButtonState {
  isOpen: boolean;
}

export {
  ILoginDialogProps,
  IPasswordInputProps,
  IPasswordInputState,
  ILoginLogoutButtonProps,
  ILoginLogoutButtonState
};

import { useSnackbar } from "notistack";

export function useNotify() {
  const { enqueueSnackbar } = useSnackbar();

  const notify = (message, options = {}) => enqueueSnackbar(message, options);
  notify.success = (message, options = {}) =>
    enqueueSnackbar(message, { variant: "success", ...options });
  notify.error = (message, options = {}) =>
    enqueueSnackbar(message, { variant: "error", ...options });
  notify.warning = (message, options = {}) =>
    enqueueSnackbar(message, { variant: "warning", ...options });
  notify.info = (message, options = {}) =>
    enqueueSnackbar(message, { variant: "info", ...options });

  return notify;
}

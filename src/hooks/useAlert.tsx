import {
  FC,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { AlertStatus } from "../enums";
import config from "../config";

type AlertProps = {
  title?: string;
  text: string;
  type: String;
  expiredAt: number;
  onClose?: () => void;
};

type AlertMessage = {
  id: number;
  title?: string;
  text: string;
  type: String;
  expiredAt: number;
};

type AlertContext = {
  showSuccessMessage: (message: string, duration?: number) => void;
  showErrorMessage: (message: string, duration?: number) => void;
  showInfoMessage: (message: string, duration?: number) => void;
  showWarningMessage: (message: string, duration?: number) => void;
};

const Context = createContext<AlertContext>({
  showSuccessMessage: () => {},
  showErrorMessage: () => {},
  showInfoMessage: () => {},
  showWarningMessage: () => {},
});




const Alert: FC<AlertProps> = () => {
  return (
    <div>Alert</div>
      );
};

export function withAlertMessage(Component: FC) {
  return (props: Record<string, unknown>) => {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<AlertMessage[]>([]);
    const element = useMemo(() => <Component {...props} />, [props]);

    const deleteMessage = (messageId: number) => {
      setMessages(messages.filter(({ id }) => id !== messageId));
    };
    const showMessage = (
      text: string,
      type: String,
      duration: number = config.DEFAULT_DURATION,
      title?: string,
    ) => {
      const now = Date.now();
      const newMessage = {
        id: now,
        title,
        text,
        type,
        expiredAt: now + duration,
      };

      setMessages([...messages, newMessage]);
    };
    const showSuccessMessage = (text: string, duration?: number) =>
      showMessage(text, AlertStatus.SUCCESS, duration, `${t("alertSuccess")}`);
    const showErrorMessage = (text: string, duration?: number) =>
      showMessage(text, AlertStatus.ERROR, duration, `${t("alertError")}`);
    const showInfoMessage = (text: string, duration?: number) =>
      showMessage(text, AlertStatus.INFO, duration);
    const showWarningMessage = (text: string, duration?: number) =>
      showMessage(text, AlertStatus.WARNING, duration);

    useEffect(() => {
      if (!messages.length) {
        return;
      }

      const minExpiredAt = messages.reduce<number>((current, { expiredAt }) => {
        return expiredAt < current ? expiredAt : current;
      }, Number.MAX_VALUE);

      setTimeout(() => {
        setMessages(messages.filter(({ expiredAt }) => expiredAt > Date.now()));
      }, minExpiredAt - Date.now());
    }, [messages]);

    return (
      <Context.Provider
        value={useMemo(
          () => ({
            showSuccessMessage,
            showErrorMessage,
            showInfoMessage,
            showWarningMessage,
          }),
          [messages],
        )}
      >
        {element}
        {messages.length ? (
          messages.map(({ id, text, type, title, expiredAt }) => (
            <Alert
              key={id}
              title={title}
              text={text}
              type={type}
              expiredAt={expiredAt}
              onClose={() => deleteMessage(id)}
            />
          ))
        ) : (
          <></>
        )}
      </Context.Provider>
    );
  };
}

export const useAlert = (): AlertContext => useContext(Context);
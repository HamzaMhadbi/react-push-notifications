interface Props {
  notification: Record<string, string>;
}

export const Message = ({ notification }: Readonly<Props>): JSX.Element => {
  return (
    <div className="d-flex flex-column">
      <div className="d-flex align-items-center">
        <img
          className="notification-icon"
          src={notification.icon || '/favicon.ico'}
          alt="Icon"
        />
        <h5>{notification.title}</h5>
      </div>
      <div className="d-flex flex-column ml-3">
        <a rel="noreferrer" href={notification.link ?? '#'} target="_blank">
          {notification.image && (
            <img
              className="notification-image"
              src={notification.image}
              alt="Img"
            />
          )}
          <p>{notification.body}</p>
        </a>
      </div>
    </div>
  );
};

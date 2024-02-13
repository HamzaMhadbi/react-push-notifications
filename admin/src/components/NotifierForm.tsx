import { useCallback, useMemo, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from 'reactstrap';
import { gql, useMutation } from '@apollo/client';

import { NotificationRecipients } from './NotificationRecipients';
import { Vibrate } from './Vibrate';
import { NotificationContextInput } from '../__generated__/graphql';
import { toast } from 'react-toastify';

const NOTIFY = gql`
  mutation Notify($notificationContext: NotificationContextInput!) {
    notify(notificationContext: $notificationContext)
  }
`;

export const NotifierForm = (): JSX.Element => {
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [icon, setIcon] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [isConditional, setIsConditional] = useState<boolean>(false);
  const [uids, setUids] = useState<string[]>([]);
  const [condition, setCondition] = useState<string>('');
  const [vibrate, setVibrate] = useState<number[]>([100, 200, 300, 400]);
  const [silent, setSilent] = useState<boolean>(false);
  const [requireInteraction, setRequireInteraction] = useState<boolean>(false);
  const [notify, { loading }] = useMutation(NOTIFY);

  const onTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    [setTitle],
  );

  const onBodyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBody(e.target.value);
    },
    [setBody],
  );

  const onIsConditionalChange = useCallback(() => {
    setIsConditional((prevState) => !prevState);
  }, [setIsConditional]);

  const onConditionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCondition(e.target.value);
    },
    [],
  );

  const onUidsChange = useCallback((uid: string = '', index?: number): void => {
    if (uid.length > 0) setUids((prevUids) => [...prevUids, uid]);
    else if (typeof index === 'number')
      setUids((prevUids) =>
        prevUids.slice(0, index).concat(prevUids.slice(index + 1)),
      );
  }, []);

  const isValidUrl = useCallback((url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }, []);

  const onIconChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value.trim();
      if (isValidUrl(url) || url.length === 0) setIcon(url);
    },
    [setIcon, isValidUrl],
  );

  const onImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = e.target.value.trim();
      if (isValidUrl(url) || url.length === 0) setImage(url);
    },
    [setImage, isValidUrl],
  );

  const onSilentChange = useCallback(() => {
    setSilent((prevState) => !prevState);
  }, [setSilent]);

  const onLinkChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLink(e.target.value.trim());
    },
    [setLink],
  );

  const onRequireInteractionChange = useCallback(() => {
    setRequireInteraction((prevState) => !prevState);
  }, [setRequireInteraction]);

  const btnDisabled = useMemo(() => {
    return (
      !title ||
      !body ||
      (isConditional && !condition) ||
      (!isConditional && uids.length === 0) ||
      loading
    );
  }, [isConditional, uids, condition, title, body, loading]);

  const handleNotify = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const notificationContext: NotificationContextInput = {
        notification: {
          title,
          body,
          link,
          icon,
          image,
          silent,
          requireInteraction,
        },
      };
      if (isConditional) notificationContext.condition = condition;
      else notificationContext.uids = uids;
      if (!silent) notificationContext.notification.vibrate = vibrate;
      const { data } = await notify({
        variables: {
          notificationContext,
        },
      });
      if (data?.notify) {
        toast.success('Notification sent successfully');
      } else toast.error('Sorry something went wrong');
    },
    [
      notify,
      title,
      body,
      uids,
      isConditional,
      condition,
      link,
      icon,
      image,
      vibrate,
      silent,
      requireInteraction,
    ],
  );

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h3" className="mb-3">
          Notifier form
        </CardTitle>
        <Form onSubmit={handleNotify}>
          <FormGroup>
            <Label for="title">
              <span className="text-danger">*</span> Title
            </Label>
            <Input
              id="title"
              className="text-capitalize"
              type="text"
              placeholder="Notification title"
              maxLength={38}
              onChange={onTitleChange}
              value={title}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="body">
              <span className="text-danger">*</span> Message
            </Label>
            <Input
              id="body"
              type="textarea"
              placeholder="Notification body"
              rows={5}
              onChange={onBodyChange}
              value={body}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label className="text-strong">
              Do you want to use a conditional query ?
            </Label>
            <FormGroup switch>
              <Input
                type="switch"
                checked={isConditional}
                onChange={onIsConditionalChange}
              />
              <Label check={isConditional}>Use condition</Label>
            </FormGroup>
          </FormGroup>
          <FormGroup>
            <Label for="uids">
              {!isConditional && <span className="text-danger">* </span>}
              Recipients
            </Label>
            <NotificationRecipients
              uids={uids}
              onChange={onUidsChange}
              disabled={isConditional}
            />
          </FormGroup>
          <FormGroup>
            <Label for="condition">
              {isConditional && <span className="text-danger">* </span>}
              Condition
            </Label>
            <Input
              id="condition"
              type="textarea"
              placeholder="Topics condition"
              rows={3}
              onChange={onConditionChange}
              disabled={!isConditional}
              required={isConditional}
              value={condition}
            />
          </FormGroup>
          <FormGroup>
            <Label for="link">Notification Link</Label>
            <Input
              id="link"
              type="textarea"
              placeholder="Notification link"
              rows={2}
              onChange={onLinkChange}
              value={link}
            />
          </FormGroup>
          <Row className="row-cols-auto g-10 align-items-center mb-2">
            <Col sm="10">
              <Label for="icon">Icon</Label>
              <Input
                id="icon"
                type="text"
                placeholder="Icon Link"
                onChange={onIconChange}
                vaue={icon}
              />
            </Col>
            <Col sm="2">
              <div className="d-flex pt-4">
                {icon?.length > 0 && (
                  <img
                    className="img-preview"
                    src={icon}
                    alt="Notification Icon"
                  />
                )}
              </div>
            </Col>
          </Row>
          <Row className="row-cols-auto g-10 align-items-center mb-2">
            <Col sm="10">
              <Label for="image">Image</Label>
              <Input
                id="image"
                type="text"
                placeholder="Image Link"
                onChange={onImageChange}
                value={image}
              />
            </Col>
            <Col sm="2">
              <div className="d-flex pt-4">
                {image?.length > 0 && (
                  <img
                    className="img-preview"
                    src={image}
                    alt="Notification Image1"
                  />
                )}
              </div>
            </Col>
          </Row>
          <Vibrate vibrate={vibrate} onChange={setVibrate} disabled={silent} />
          <FormGroup>
            <Label className="text-strong">
              Do you want to use silent mode ?
            </Label>
            <FormGroup switch>
              <Input type="switch" checked={silent} onChange={onSilentChange} />
              <Label check={silent}>Use silent mode</Label>
            </FormGroup>
          </FormGroup>
          <FormGroup>
            <Label className="text-strong">
              This notification require interaction ?
            </Label>
            <FormGroup switch>
              <Input
                type="switch"
                checked={requireInteraction}
                onChange={onRequireInteractionChange}
              />
              <Label check={requireInteraction}>Yes !</Label>
            </FormGroup>
          </FormGroup>
          <Button
            className="float-right"
            color="primary"
            type="submit"
            outline
            disabled={btnDisabled}>
            {loading && <Spinner className="mr-2" size="sm" color="primary" />}
            Send notification(s)
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

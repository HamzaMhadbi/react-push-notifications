import { getToken, onMessage } from 'firebase/messaging';
import { memo, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';
import { gql, useMutation } from '@apollo/client';

import { messaging } from '../services';
import { Profile } from '../__generated__/graphql';

import { Message } from './Message';

const UPDATE_FCM_TOKEN = gql`
  mutation updateFCMToken($fcmToken: String!) {
    updateFCMToken(fcmToken: $fcmToken)
  }
`;

interface Props {
  profile?: Profile;
}

export const FCM = memo(
  ({ profile }: Readonly<Props>): JSX.Element => {
    const [fcmToken, setFcmToken] = useState<string>();
    const [updateFCMToken] = useMutation<boolean>(UPDATE_FCM_TOKEN);

    const handleCopyProfileId = useCallback(() => {
      navigator.clipboard.writeText(profile?.id ?? '');
      toast.success('Profile ID successfully copied', { autoClose: 1500 });
    }, [profile?.id]);

    const handleCopyfcmToken = useCallback(() => {
      navigator.clipboard.writeText(fcmToken ?? '');
      toast.success('FCM Token successfully copied', { autoClose: 1500 });
    }, [fcmToken]);

    useEffect(() => {
      if (fcmToken) {
        updateFCMToken({
          variables: {
            fcmToken,
          },
        });
      }
    }, [fcmToken, updateFCMToken]);

    useEffect(() => {
      if (profile) {
        console.log('Requesting permission...');
        Notification.requestPermission()
          .then((permission) => {
            if (permission === 'granted') {
              console.log('Notification permission granted.');
              getToken(messaging, {
                vapidKey: process.env.REACT_APP_FIREBASE_VAPID,
              })
                .then((currentToken) => {
                  if (currentToken) {
                    setFcmToken(currentToken);
                    onMessage(messaging, (payload) => {
                      toast(
                        <Message
                          notification={payload.data as Record<string, string>}
                        />,
                        { autoClose: 3000, bodyClassName: 'notification' },
                      );
                    });
                  } else
                    console.log(
                      'No registration token available. Request permission to generate one.',
                    );
                })
                .catch((err) => {
                  console.log(
                    'An error occurred while retrieving token. ',
                    err,
                  );
                });
            } else console.log('Permission status: ', permission);
          })
          .catch((err) => {
            console.log('An error occurred while requesting permission. ', err);
          });
      }
    }, [profile]);

    return (
      <>
        <Card>
          <CardBody>
            <Badge className="mb-3" color="primary" pill={false}>
              Step 2
            </Badge>
            <CardTitle tag="h3" className="mb-3">
              Profile Messaging informations
            </CardTitle>
            {profile && (
              <FormGroup row>
                <Label tag="h4" sm="12" for="profileId">
                  Profile ID
                </Label>
                <Col sm="12">
                  <Input
                    id="profileId"
                    name="profileId"
                    type="text"
                    value={profile.id}
                    disabled
                  />
                </Col>
                <Col sm="12">
                  <Button
                    className="mt-2"
                    color="warning"
                    onClick={handleCopyProfileId}
                    block>
                    <i className="bi bi-copy"></i> Copy the profile ID
                  </Button>
                </Col>
              </FormGroup>
            )}
            <FormGroup row>
              <Label className="mb-2" tag="h4" sm="12" for="fcmToken">
                Retrieving The Firebase Cloud Messaging Token
              </Label>
              {fcmToken ? (
                <>
                  <Col sm={12}>
                    <Input
                      id="fcmToken"
                      name="fcmToken"
                      type="textarea"
                      value={fcmToken}
                      rows="5"
                      disabled
                    />
                  </Col>
                  <Col sm={12}>
                    <Button
                      className="mt-2"
                      color="warning"
                      block
                      onClick={handleCopyfcmToken}>
                      <i className="bi bi-copy"></i> Copy The FCM Token
                    </Button>
                  </Col>
                </>
              ) : (
                <Col sm={12}>
                  <span>I'm ready to retrieve your FCM Token 😎</span>
                </Col>
              )}
            </FormGroup>
          </CardBody>
        </Card>
      </>
    );
  },
  (prevProps: Readonly<Props>, props: Readonly<Props>) =>
    typeof prevProps.profile === 'object' && typeof props.profile === 'object',
);

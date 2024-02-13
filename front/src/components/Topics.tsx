import { useCallback } from 'react';
import { gql } from '@apollo/client';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import { toast } from 'react-toastify';

import { Topic } from '../__generated__/graphql';

export const PROFILE_TOPICS_FRAGMENT = gql`
  fragment ProfileTopicsFragment on Profile {
    topics {
      value
      description
    }
  }
`;

interface Props {
  topics: Topic[];
}

export const Topics = ({ topics }: Readonly<Props>): JSX.Element => {
  const handleCopyTopic = useCallback((topic: string) => {
    navigator.clipboard.writeText(topic);
    toast.success('Topic successfully copied', { autoClose: 1000 });
  }, []);

  return (
    <Card className="mt-2">
      <CardBody>
        <Badge className="mb-3" color="primary" pill={false}>
          Step 3
        </Badge>
        <CardTitle tag="h3" className="mb-3">
          Your profile is subcribed to topics
        </CardTitle>
        {topics.length > 0 ? (
          <ListGroup>
            {topics.map((topic) => (
              <ListGroupItem key={topic.value}>
                <div className="d-flex align-items-center justify-content-between">
                  {topic.description}
                  <Button
                    size="sm"
                    className="mt-2"
                    color="warning"
                    onClick={() => {
                      handleCopyTopic(topic.value);
                    }}>
                    <i className="bi bi-copy text-sm-left"></i> Copy value
                  </Button>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        ) : (
          <Col sm="12">
            <span>I'm ready to retrieve your topics 😎</span>
          </Col>
        )}
      </CardBody>
    </Card>
  );
};

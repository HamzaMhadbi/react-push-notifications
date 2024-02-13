import { useCallback, useState } from 'react';
import { Button, Col, Input, Row } from 'reactstrap';

interface Props {
  onChange(profileId: string, index?: number): void;
  uids: string[];
  disabled: boolean;
}

export const NotificationRecipients = ({
  onChange,
  uids,
  disabled,
}: Readonly<Props>): JSX.Element => {
  const [uid, setUid] = useState<string>('');

  const onUidChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUid(e.target.value.trim());
    },
    [setUid],
  );

  const handleAddUid = useCallback(() => {
    onChange(uid);
    setUid('');
  }, [onChange, uid]);

  const handleRemoveUid = useCallback(
    (index: number) => {
      onChange('', index);
    },
    [onChange],
  );

  return (
    <>
      {uids.map((profileId, index) => (
        <Row
          key={`${profileId}-${index}`}
          className="row-cols-sm-auto g-10 mb-2">
          <Col md="8" sm="12">
            <Input
              type="text"
              placeholder="Profile ID"
              value={profileId}
              disabled
            />
          </Col>
          <Col sm="4" xs="12">
            <Button
              size="sm"
              type="button"
              color="danger"
              block
              onClick={() => {
                handleRemoveUid(index);
              }}
              disabled={disabled}>
              <i className="bi bi-trash"></i> Remove
            </Button>
          </Col>
        </Row>
      ))}
      <Row className="row-cols-sm-auto g-10 align-items-center">
        <Col md="8" sm="12">
          <Input
            id="uid"
            type="text"
            placeholder="Profile ID"
            value={uid}
            onChange={onUidChange}
            disabled={disabled}
          />
        </Col>
        <Col sm="4" xs="12">
          <Button
            size="sm"
            type="button"
            color="primary"
            disabled={disabled ?? uid.length === 0}
            block
            onClick={handleAddUid}>
            <i className="bi bi-plus"></i> Add
          </Button>
        </Col>
      </Row>
    </>
  );
};

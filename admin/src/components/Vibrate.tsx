import { useCallback } from 'react';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';

interface Props {
  onChange(vibrate: number[]): void;
  vibrate: number[];
  disabled: boolean;
}

export const Vibrate = ({
  onChange,
  vibrate,
  disabled,
}: Readonly<Props>): JSX.Element => {
  const onVibrateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const newVibrate = [...vibrate];
      newVibrate[index] = Number.parseInt(e.target.value);
      onChange(newVibrate);
    },
    [vibrate, onChange],
  );
  return (
    <FormGroup>
      <Label for="vibrate">Vibrate</Label>
      <Row className="row-cols-lg-auto g-3 align-items-center">
        {vibrate.map((v, index) => (
          <Col sm="12" key={`${index}`}>
            <Input
              type="number"
              onChange={(e) => {
                onVibrateChange(e, index);
              }}
              defaultValue={v}
              disabled={disabled}
            />
          </Col>
        ))}
      </Row>
    </FormGroup>
  );
};

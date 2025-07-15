import { Button, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export default function TestModal() {
  return (
    <Button
      onClick={() => {
        Modal.confirm({
          title: 'Test Modal',
          content: 'Bạn có thấy modal này không?',
          icon: <DeleteOutlined />,
          getContainer: false,
        });
      }}
    >
      Test Modal
    </Button>
  );
} 
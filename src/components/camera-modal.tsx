import { useRef, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Webcam from 'react-webcam';

interface CameraModalBtnProps {
  text: string;
  onCaptureImage: (image: string) => void;
}

export const CameraModalBtn: React.FC<CameraModalBtnProps> = (props) => {
  const webcamRef = useRef<Webcam | null>(null);
  const [shouldShowModal, setShouldShowModal] = useState<boolean>(false);

  const handleTakePicture = async () => {
    // Ask for permission to use the camera

    setShouldShowModal(true);
  };

  const captureImage = () => {
    const picture = webcamRef.current?.getScreenshot();
    if (picture) {
      props.onCaptureImage(picture);
    }
    setShouldShowModal(false);
  };

  return (
    <>
      <Button onClick={() => handleTakePicture()}>Take picture</Button>

      <Modal show={shouldShowModal} onHide={() => setShouldShowModal(false)} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Take picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Webcam
            ref={webcamRef}
            className='w-100'
            onUserMediaError={(e) => {
              alert('Could not access the camera:' + e);
            }}
          />

          <Button onClick={captureImage}>Take picture</Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

import {Box, Button, Modal, TextField} from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import {Form, Formik} from "formik";
import {deleteTopic} from "../../utils/Request";
import {Topic} from "../../utils/Type";
import {useState} from "react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";

interface DestroyProps {
    topic: Topic;
    deleteTopicState: (topic: Topic) => void;
}

const Destroy: React.FC<DestroyProps> = ({topic, deleteTopicState}) => {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Tooltip title="Delete Topic">
                <button className="text-delete" onClick={handleOpen}><DeleteForeverIcon/></button>
            </Tooltip>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}
                     className="w-full max-w-[674px] flex flex-col divide-y space-y-4 rounded-md"
                >
                    <div
                        className="flex items-center justify-between text-2xl text-main-700 font-bold">
                        <h5>
                            Delete Topic
                        </h5>
                        <CancelPresentationIcon onClick={handleClose}/>
                    </div>

                    <Formik
                        initialValues={{}}
                        onSubmit={async (values, {setSubmitting}) => {
                            const response = await deleteTopic(topic.id);
                            setSubmitting(false);
                            if (response.status === 200) {
                                const topic = response.data as Topic;
                                deleteTopicState(topic)
                                handleClose()
                            }

                        }}
                    >
                        {({isSubmitting, errors}) => (
                            <Form className="pt-10 flex flex-col gap-y-6 text-center">
                                <h4 className="px-10">
                                    Are you sure you want to delete the topic <b>{topic.name}</b>
                                    ? Deleting this topic would also delete all questions under this topic.
                                </h4>
                                <div
                                    className="col-span-full flex justify-center space-x-5 text-xs font-bold">

                                    <Button variant="contained"
                                            className="min-w-[88px] h-[29x] bg-delete capitalize hover:bg-red-600"
                                            type="submit"
                                    >
                                        Delete
                                    </Button>
                                    <Button variant="contained"
                                            className="min-w-[88px] h-[29x] bg-neutral-light-200 text-neutral-light-700 capitalize hover:bg-orange-400 hover:text-white"
                                            onClick={handleClose}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>

                </Box>
            </Modal>
        </>
    );
}


export default Destroy
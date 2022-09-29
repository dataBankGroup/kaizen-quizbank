import {Box, Button, Modal, TextField} from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import {Form, Formik} from "formik";
import {updateTopic} from "../../utils/Request";
import {Topic} from "../../utils/Type";
import {useState} from "react";
import * as yup from "yup";
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from "@mui/material/Tooltip";

interface EditProps {
    topic: Topic;
    updateTopicState: (topic: Topic) => void;
}

const Edit: React.FC<EditProps> = ({topic, updateTopicState}) => {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const validationSchema = yup.object({
        name: yup.string().required("This is a required field."),
    });

    return (
        <>
             <Tooltip title="Edit Topic">
                 <button className="text-amber-400" onClick={handleOpen}><EditIcon /></button>
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
                        className="flex items-center justify-between text-2xl text-amber-400 font-bold">
                        <h5>
                            Update Topic
                        </h5>
                        <CancelPresentationIcon onClick={handleClose}/>
                    </div>
                    <Formik
                        initialValues={{name: topic.name, course_id: topic.course_id}}
                        onSubmit={async (values, {setSubmitting}) => {
                            const response = await updateTopic(topic.id, values);
                            setSubmitting(false);
                            if (response.status === 200) {
                                const responseTopic = response.data as Topic;
                                updateTopicState(responseTopic);
                                handleClose();
                            }
                        }}

                        validationSchema={validationSchema}
                    >
                        {({isSubmitting, values, handleChange, dirty, errors}) => (
                            <Form className="pt-10 flex flex-col gap-y-6 ">
                                <TextField id="outlined-basic"
                                           label="Topic Title"
                                           variant="outlined"
                                           className="w-full"
                                           name="name"
                                           value={values.name}
                                           onChange={handleChange}
                                           helperText={errors.name}
                                           error={!!errors.name}
                                />
                                <div
                                    className="col-span-full flex justify-center space-x-5 text-xs font-bold">
                                    <Button variant="contained"
                                            className="min-w-[88px] h-[29x] bg-neutral-light-200 hover:bg-orange-400 hover:text-white text-neutral-light-700 capitalize"
                                            onClick={handleClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button variant="contained"
                                            className="min-w-[88px] h-[29x] bg-neutral-600 hover:bg-neutral-600 capitalize"
                                            type="submit"
                                            disabled={isSubmitting || !dirty}
                                    >
                                        Update
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


export default Edit
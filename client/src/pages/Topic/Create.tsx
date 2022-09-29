import {Box, Button, Modal, TextField} from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import {Form, Formik} from "formik";
import {createTopic} from "../../utils/Request";
import {Topic} from "../../utils/Type";
import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import * as yup from "yup";

const Create = () => {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const params = useParams();
    const navigate = useNavigate();

    const validationSchema = yup.object({
        name: yup.string().required("This is a required field."),
    });

    return (
        <>
            <Button variant="contained"
                    className="flex space-x-4 min-w-[88px] h-[35px] font-bold bg-neutral-700 hover:bg-neutral-600 capitalize"
                    onClick={handleOpen}
            >
                Add Topic
            </Button>
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
                            Add Topic
                        </h5>
                        <CancelPresentationIcon onClick={handleClose}/>
                    </div>


                    <Formik
                        initialValues={{name: '', course_id: params.id as string}}
                        onSubmit={async (values, {setSubmitting}) => {
                            const response = await createTopic(values);
                            setSubmitting(false);
                            if (response.status === 200) {
                                const topic = response.data as Topic;
                                navigate(`/topics/${topic.id}`);
                            }
                        }}
                        validationSchema={validationSchema}
                    >
                        {({isSubmitting, values, handleChange, errors}) => (
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
                                            className="min-w-[88px] h-[29x] bg-neutral-light-200 text-neutral-light-700 capitalize hover:bg-orange-400 hover:text-white"
                                            onClick={handleClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button variant="contained"
                                            className="min-w-[88px] h-[29x] bg-neutral-700 hover:bg-neutral-600 capitalize"
                                            type="submit"
                                            disabled={isSubmitting}
                                    >
                                        Add Topic
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


export default Create
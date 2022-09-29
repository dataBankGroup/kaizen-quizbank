import {Course, Question} from "../../utils/Type";
import React, {useState} from "react";
import {Box, Button, Modal} from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import {Form, Formik} from "formik";
import {deleteCourse} from "../../utils/Request";
import {useNavigate} from "react-router-dom";

interface DeleteProps {
    course: Course
}


const Destroy: React.FC<DeleteProps> = ({course}) => {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const navigate = useNavigate();


    return (
        <div>
            <button
                className="rounded bg-delete w-[120px] h-[35px] flex items-center justify-center text-white text-sm hover:bg-red-600"
                onClick={handleOpen}>
                Delete Course
            </button>

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
                            Delete Course
                        </h5>
                        <CancelPresentationIcon onClick={handleClose}/>
                    </div>

                    <Formik
                        initialValues={{}}
                        onSubmit={async (values, {setSubmitting}) => {
                            const response = await deleteCourse(course.id);
                            setSubmitting(false);
                            if (response.status === 200) {
                                const course = response.data as Course;
                                handleClose()
                                navigate("/")
                            }

                        }}
                    >
                        {({isSubmitting, errors}) => (
                            <Form className="pt-10 flex flex-col gap-y-6 text-center">
                                <h4 className="px-10">
                                    Are you sure you want to delete this course?
                                </h4>
                                <div
                                    className="col-span-full flex justify-center space-x-5 text-xs font-bold">

                                    <Button variant="contained"
                                             className="min-w-[88px] h-[29x] bg-delete capitalize hover:bg-red-600"
                                            type="submit"
                                            disabled={isSubmitting}
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
        </div>

    );
}

export default Destroy;
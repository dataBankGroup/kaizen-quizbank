import {Box, Button, Modal} from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import {Question} from "../../utils/Type";
import {useState} from "react";
import {deleteQuestion} from "../../utils/Request";
import {Formik, Form} from 'formik';
import Tooltip from "@mui/material/Tooltip";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";


interface DeleteProps {
    question: Question;
    deleteQuestionState: (question: Question) => void;
}

const Destroy: React.FC<DeleteProps> = ({question, deleteQuestionState}) => {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>
            <Tooltip title="Delete Question">
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
                        className="flex items-center justify-between text-2xl text-amber-400 font-bold">
                        <h5>
                            Delete Question
                        </h5>
                        <CancelPresentationIcon onClick={handleClose}/>
                    </div>

                    <Formik
                        initialValues={{}}
                        onSubmit={async (values, {setSubmitting}) => {
                            const response = await deleteQuestion(question.id);
                            setSubmitting(false);
                            if (response.status === 200) {
                                const question = response.data as Question;
                                deleteQuestionState(question)
                                handleClose()
                            }

                        }}
                    >
                        {({isSubmitting, errors}) => (
                            <Form className="pt-10 flex flex-col gap-y-6 text-center">
                                <h4 className="px-10">
                                    Are you sure you want to delete this question?
                                </h4>
                                <div
                                    className="col-span-full flex justify-center space-x-5 text-xs font-bold">

                                    <Button variant="contained"
                                            className="min-w-[88px] h-[29x] bg-delete hover:bg-red-600 capitalize"
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
        </>
    );
}


export default Destroy
import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
    Autocomplete,
    Box,
    Button, Checkbox, IconButton,
    Modal,
    Paper,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import {FieldArray, Form, Formik} from "formik";
import {updateCourse} from "../../utils/Request";
import {Course, User} from "../../utils/Type";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface AuthorUpdateProps {
    course: Course;
    users: User[];
    updateAuthorState: (course: Course) => void;
}

interface Author {
    id: string,
    is_primary_author: boolean
}


const addFormValues = (event: any, author: any, values: { authors: User[] }, setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void) => {
    const exists = values.authors.findIndex((auth) => auth.id == author.id);
    if (exists === -1) {
        const newValues = [...values.authors, author as User];
        setFieldValue("authors", newValues)
    }

}

const AuthorUpdate: React.FC<AuthorUpdateProps> = ({course, users, updateAuthorState}) => {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button variant="contained"
                    className="flex min-w-[88px] h-[35px] font-bold bg-neutral-700 hover:bg-neutral-600 capitalize"
                    onClick={handleOpen}
            >
                {course.co_authors.length > 0 ? "Update Co-Authors" : "Add Co-Authors"}
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
                            {course.co_authors.length > 0 ? "Update Co-Authors" : "Add Co-Authors"}
                        </h5>
                        <CancelPresentationIcon onClick={handleClose}/>
                    </div>

                    <Formik
                        initialValues={{
                            authors: course.co_authors
                        }}
                        onSubmit={async (values, {setSubmitting}) => {

                            let updateValues = {
                                authors: values.authors.map((author) => {
                                    return {id: author.id, is_primary_author: false}
                                })
                            }
                            const response = await updateCourse(course.id, {
                                authors: [...updateValues.authors, {
                                    id: course.primary_author.id,
                                    is_primary_author: true
                                }]
                            });
                            setSubmitting(false);
                            if (response.status === 200) {
                                const responseData = response.data as Course;
                                updateAuthorState(responseData);
                            }
                            handleClose()
                        }}
                    >
                        {({isSubmitting, values, errors, dirty, resetForm, setFieldValue}) => (
                            <Form className="pt-10 flex flex-col gap-y-6 text-center">
                                <Autocomplete
                                    options={users.filter(user => user.id !== course.primary_author.id)}
                                    getOptionLabel={(option) => (option as User).first_name + " " + (option as User).last_name}
                                    renderInput={(params) => <TextField {...params} label="Authors"/>}
                                    onChange={(event, value) => addFormValues(event, value, values, setFieldValue)}
                                />

                                <FieldArray
                                    name="authors"
                                    render={arrayHelpers => (
                                        <TableContainer component={Paper}>
                                            <Table aria-label="simple table">
                                                <TableHead style={{background: "#F9F9FA"}}>
                                                    <TableRow  className="text-3xl">
                                                        <TableCell align="left" className="text-lg font-bold">Selected Co-Authors</TableCell>
                                                        <TableCell align="right" className="text-lg font-bold">Remove</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {values.authors && values.authors.map((author: User, index) => (
                                                        <TableRow
                                                            key={index}
                                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                                        >
                                                            <TableCell
                                                                align="left" className="text-lg">{author.first_name + " " + author.last_name}</TableCell>
                                                            <TableCell align="right"
                                                                       className="flex items-center gap-x-2 text-lg font-bold">
                                                                <button type="button" className="text-delete"
                                                                        onClick={() => arrayHelpers.remove(index)}>
                                                                    <PersonRemoveIcon />
                                                                </button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                />

                                <div className="col-span-full flex justify-center space-x-5 text-xs font-bold">
                                    <Button variant="contained"
                                            className="min-w-[88px] h-[35px] bg-neutral-light-200 hover:bg-orange-400 hover:text-white text-neutral-light-700 capitalize"
                                            onClick={() => {
                                                resetForm();
                                                handleClose();
                                            }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button variant="contained"
                                            type="submit"
                                            className="min-w-[88px] h-[35px] bg-neutral-700 hover:bg-neutral-600 capitalize "
                                            disabled={isSubmitting || !dirty}
                                    >
                                        Update Co-authors
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


export default AuthorUpdate;
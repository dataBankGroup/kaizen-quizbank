import {Course} from "../../utils/Type";
import {Box, Button, Card, IconButton, Menu, MenuItem, Modal} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, {useState} from "react";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import {Form, Formik} from "formik";
import {deleteCourse} from "../../utils/Request";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface CourseCardsProps {
    course: Course;
    permission: boolean;
}

const CourseCards: React.FC<CourseCardsProps> = ({course, permission}) => {
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClosePopup = () => {
        setAnchorEl(null);
    };

    const [openModal, setOpenModel] = useState(false);
    const handleOpen = () => setOpenModel(true);
    const handleClose = () => setOpenModel(false);

    const navigateEdit = () => {
        handleClosePopup()
        navigate(`/courses/edit/${course.id}`)

    }

    return (
        <Card className="p-4 space-y-2 min-w-[380px] max-w-[380px]" key={course.id}>

            <div>
                <h3 className="block text-2xl font-extrabold">
                    {course.code}
                </h3>
                <p className="block  opacity-60 font-semibold">
                    {course.title}
                </p>
            </div>

            <hr className="pt-2"/>

            <div className="flex flex-col justify-between">
                <div className="block pb-1">

                    <p className="text-sm opacity-60 truncate">
                        {course.description}
                    </p>
                </div>

                <div className="flex justify-between items-center font-bold gap-2">
                    <Link to={`/courses/${course.id}`}>
                        <button className="font-bold text-yellow-400 flex align-items gap-x-2">
                            <OpenInNewIcon/>
                            OPEN
                        </button>
                    </Link>
                    <div className="flex gap-2">
                        <div className="text-sm opacity-60 flex gap-1 items-center">
                            <PermIdentityIcon/>
                            {course.primary_author.first_name}
                        </div>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? 'demo-positioned-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                            className="opacity-60 h-10"
                        >
                            <MoreVertIcon/>
                        </IconButton>
                        <Menu
                            id="demo-positioned-menu"
                            aria-labelledby="demo-positioned-button"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClosePopup}
                            transformOrigin={{horizontal: 'right', vertical: 'top'}}
                            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                        >
                            <MenuItem onClick={navigateEdit}>Edit</MenuItem>
                            {permission &&
                                <MenuItem onClick={handleOpen}>Delete</MenuItem>
                            }
                        </Menu>


                    </div>
                </div>
            </div>

            <Modal
                open={openModal}
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
                     className="w-[674px] flex flex-col divide-y space-y-4 rounded-md"
                >
                    <div
                        className="flex items-center justify-between text-2xl text-amber-400 font-bold">
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
                                handleClose()
                                window.location.reload();
                            }

                        }}
                    >
                        {({isSubmitting}) => (
                            <Form className="pt-10 flex flex-col gap-y-6 text-center">
                                <h4 className="px-10">
                                    Are you sure you want to delete this course?
                                </h4>
                                <div
                                    className="col-span-full flex justify-center space-x-5 text-xs font-bold">

                                    <Button variant="contained"
                                            className="min-w-[88px] h-[29x] bg-delete capitalize"
                                            type="submit"
                                            disabled={isSubmitting}
                                    >
                                        Delete
                                    </Button>
                                    <Button variant="contained"
                                            className="min-w-[88px] h-[29x] bg-neutral-light-200 hover:bg-orange-400 hover:text-white text-neutral-light-700 capitalize"
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
        </Card>
    );
}

interface IndexProps {
    courses: Course[];
    userId: string;
}

const Index: React.FC<IndexProps> = ({courses, userId}) => {
    return (
        <div className="flex flex-wrap gap-10 justify-center sm:justify-start sm:pl-7">
            {courses.map((course: Course) => <CourseCards course={course}
                                                          permission={course.primary_author.id === userId}/>)}
        </div>
    );
}

export default Index;
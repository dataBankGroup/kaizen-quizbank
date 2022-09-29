import {Topic} from "../../utils/Type";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import DestroyTopic from "./Destroy";
import EditTopic from "./Edit";
import {Link} from "react-router-dom";
import React, {useContext} from "react";
import PreviewIcon from '@mui/icons-material/Preview';
import Tooltip from '@mui/material/Tooltip';

interface IndexProps {
    topics: Topic[];
    updateTopicState: (topic: Topic) => void;
    deleteTopicState: (topic: Topic) => void;
    permission: boolean;
}


const Index: React.FC<IndexProps> = ({topics, updateTopicState, deleteTopicState, permission}) => {

    return (
         <TableContainer component={Paper} className="w-full max-w-[1000px]">
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead style={{background: "#F9F9FA"}}>
                    <TableRow>
                        <TableCell style={{width: 50}} className="text-lg font-bold">No.</TableCell>
                        <TableCell align="left" className="text-lg font-bold">Topic</TableCell>
                        <TableCell align="right" className="text-lg font-bold">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {topics.map((topic, index) => (
                        <TableRow
                            key={topic.id}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row" className="text-lg">
                                {index + 1}
                            </TableCell>
                            <TableCell align="left" className="truncate text-ellipsis max-w-[180px] text-lg">{topic.name}</TableCell>
                            <TableCell align="right" className="flex items-center gap-x-2 text-lg">

                                {permission &&
                                <DestroyTopic topic={topic} deleteTopicState={deleteTopicState}/>
                                }
                                {permission && <span>|</span>}
                                    <EditTopic topic={topic} updateTopicState={updateTopicState}/>
                                |
                                <Link to={`/topics/${topic.id}`}>
                                    <Tooltip title="View Topic">
                                       <button className="text-amber-400"><PreviewIcon /></button>
                                    </Tooltip>

                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default Index;
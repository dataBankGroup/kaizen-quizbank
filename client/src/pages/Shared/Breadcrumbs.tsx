import {Link} from "react-router-dom";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import React from "react";

interface BreadCrumbsProps {
    link: string;
    pageTitle: string;
}


const BreadCrumbs: React.FC<BreadCrumbsProps> = ({link, pageTitle}) => {
    return (
        <div className="block flex space-x-6 sm:space-x-18 mb-8 sm:mb-14 items-center">
            <Link to={link}>
                <button className="text-3xl font-semibold text-shades-text-100 flex items-center gap-x-3">
                    <ArrowBackIosNewIcon className="h-4"/>
                    Back
                </button>
            </Link>
            <div className="flex text-2xl font-semibold space-x-6  uppercase">
                <u className="text-amber-400">{pageTitle}</u>
            </div>
        </div>
    );
}


export default BreadCrumbs;


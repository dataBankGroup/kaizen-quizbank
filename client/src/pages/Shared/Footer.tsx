import React from "react";

const Footer = () => {

    return (
        <footer
            className="w-full h-auto bg-neutral-800 flex flex-col justify-center items-center gap-y-2 py-4 px-2">

            <div className="block p-1">
                    <p className="font-medium text-sm text-white text-center">
                        Jay Merie Ann C. Bugarin <span className="text-black">| </span>
                        Jefte N. Galola <span className="text-black">| </span>
                        Beatrix DG. Liongson <span className="text-black">| </span>
                        Rasvi Rupert C. Namit <span className="text-black">| </span>
                        Danica Lyka T. Pineda <span className="text-black">| </span>
                        Josh Lenuel B. Pontillas <span className="text-black">| </span>
                        Rejay Mar V. Señar <span className="text-black">| </span>
                        Kevin Kyle R. Villavicencio
                    </p>
            </div>
            <p className="text-white text-xs text-center">
                Copyright © 2022:  <strong> TIP - Kaizen</strong>. All Rights Reserved.
            </p>

        </footer>
    );

}


export default Footer;
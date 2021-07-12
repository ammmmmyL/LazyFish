import React from "react";
import { Link } from 'react-router-dom';
import "./css/navBar_style.css";
import "./css/index.css";
import "./css/homePage_style.css";

class AboutUs extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("In AboutUs")
        return (
            <React.Fragment>
                <div id="main-container">
                    <div className="container">
                    <div className="transparentbox-des">
                    <p className="aboutInfo">
                        Welcome to LazyFish, your number one source for all cameras. </p>
                     <p> We're dedicated to giving you the very best of second-hand cameras, with a focus on variety, reliability and uniqueness.</p>
                    <p>Founded in Feb, 2021 by Past, Amy and Allie, LazyFish has come a long way from its beginnings in a CSC309 group project proposal. </p>
                    <p> When LaztFish first started out, our passion for providing the best camera e-commerce website drove us to do intense research and practice in Javascript React, and gave us the impetus to turn hard work and inspiration into to a booming online platform. </p>
                    <p>We now serve customers all over the Ontario area, and are thrilled to be a part of the fair trade wing of the cameras industry.</p>
                    <p> We hope you enjoy shopping on our website as much as we enjoy offering it to you. </p>
                    <p> If you have any questions or comments, please don't hesitate to contact us.</p>

                    <p> Sincerely,</p>
                       <p> Past, Amy, and Allie <span>&#9825;,</span></p>
                        Founder of LazyFish.Inc
                   </div>  
                    </div>
                <div className="fixed-bottom">
                    <footer className="footer">
                        <div id="slogan">
                            <span>This is a website for camera lovers</span>
                        </div>
                    </footer>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default AboutUs;
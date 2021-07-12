import React from "react";
import { Route } from "react-router-dom";

import NavBarTopL from "./navBarTopLogin";
import NavBarTopS from "./navBarTopSignout";
import AdminNav from "./AdminComponents/adminNav";

class ChangeNav extends React.Component {
    render() {
        const {
            component: RoutedComponent,
            layout,
            user,
            items,
            mainComponent,
        } = this.props;
        // print current view in console.log
        console.log("in changeNav")
        console.log(layout);
        //console.log(this.props.mainComponent.state.currentUser)
        const pageContent = (
            <Route
                render={(props) => (
                    <RoutedComponent
                        user={user}
                        items={items}
                        mainComponent={mainComponent}
                    />
                )}
            />
        );

        switch (layout) {
            case "adminView": {
                return (
                    <div>
                        <AdminNav mainComponent={mainComponent}/>
                        {pageContent}
                    </div>
                );
            }
            case "userView": {
                if (this.props.mainComponent.state.currentUser != null) {
                    return (
                        <div>
                            <NavBarTopS mainComponent={mainComponent}/>
                            {pageContent}
                        </div>
                    );
                }
                else {
                    console.log(this.props.mainComponent.state.currentUser)
                    return (
                        <div>
                            <NavBarTopL />
                            {pageContent}
                        </div>
                    );
                }
            }
            default: {
                return (
                    <div>
                        <NavBarTopL />
                        {pageContent}
                    </div>
                );
            }
        }
    }
}

export default ChangeNav;

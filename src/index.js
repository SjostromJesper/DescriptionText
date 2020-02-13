import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {Button, Textarea} from '@contentful/forma-36-react-components';
import {init, locations} from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import PropTypes from "prop-types";
import Markdown from 'markdown-to-jsx';
import F36Tokens from '@contentful/forma-36-tokens';

const App = (props) => {
    const [role, setRole] = useState('');
    const [value, setValue] = useState(props.sdk.field.getValue() || '');
    const [edit, setEdit] = useState(true);

    const changeRoleValue = (role) => {
        setRole(role);
    };

    const checkUserRole = () => {
        props.sdk.user.spaceMembership.roles.forEach((role) => {
            console.log(role.name);
            if (role.name === "Editor") {
                changeRoleValue(role.name);
            }
        });
    };

    useEffect(() => {
        props.sdk.window.startAutoResizer();
        checkUserRole();

        // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
        const detachExternalChangeHandler = props.sdk.field.onValueChanged(onExternalChange);

        return () => {
            if (detachExternalChangeHandler) {
                detachExternalChangeHandler();
            }
        }
    }, []);

    const onExternalChange = value => {
        setValue(value);
    };

    const onChange = e => {
        const value = e.currentTarget.value;
        setValue(value);
        if (value) {
            props.sdk.field.setValue(value);
        } else {
            props.sdk.field.removeValue();
        }
    };

    const onEditChange = () => {
        setEdit(edit ? !edit : true);
    };

    const CurrentDescription = () => {
        return (
            <Markdown
                children={value}
                options={{
                    createElement(type, props, children) {
                        return (
                            <div className="parent">
                                {React.createElement(type, props, children)}
                            </div>
                        );
                    },
                }}
            />
        )
    };

    const descriptionBoxStyle = {
        fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol",
        //border: '1px solid rgba(0, 0, 0, 0.08)'
    };

    const buttonStyle = {
        marginBottom: '2px'
    };

    return (
        <>
            <div>
                {role === "Editor" ? (<Button style={buttonStyle} onClick={onEditChange}>Edit</Button>) : null}
                {(edit && role === "Editor") ? (<Textarea
                        rows={8}
                        labelText={""}
                        id={"id"}
                        testId={"my-field"}
                        name={"herro"}
                        value={value}
                        isFullWidth={true}
                        onChange={onChange}/>)
                    : (<div style={descriptionBoxStyle}><CurrentDescription
                        text={value}/></div>)}
            </div>
        </>
    );
};

init(sdk => {
        ReactDOM.render(<App sdk={sdk}/>, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
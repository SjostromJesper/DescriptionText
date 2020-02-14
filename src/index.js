import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {Button, Textarea, Note} from '@contentful/forma-36-react-components';
import {init} from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import Markdown from 'markdown-to-jsx';

const App = (props) => {
    const [boxColor, setBoxColor] = useState("primary");
    const [editorRoles, setEditorRole] = useState(props.sdk.parameters.instance.editRights);
    const [value, setValue] = useState(props.sdk.field.getValue() || '');
    const [edit, setEdit] = useState(false);
    const [isEditor, setIsEditor] = useState(false);

    const changeRoleValue = (value) => {
        const er = editorRoles.toLowerCase();
        if(er.includes(value)) {
            setIsEditor(true);
        }
    };

    const checkUserRole = () => {
        props.sdk.user.spaceMembership.roles.forEach((role) => {
            const roleName = role.name.toLowerCase();
            changeRoleValue(roleName);
        });
    };

    useEffect(() => {
        props.sdk.window.startAutoResizer();
        setBoxColor(props.sdk.parameters.instance.boxColor);

        const res = editorRoles.split(",").map(ed => ed.toLowerCase().trim());
        setEditorRole(res);
        checkUserRole();

        //changeEditRoleValue(props.sdk.parameters.instance.editRights);
        //checkUserRole();

        // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
        const detachExternalChangeHandler = props.sdk.field.onValueChanged(() => {});

         return () => {
             if (detachExternalChangeHandler) {
                 detachExternalChangeHandler();
             }
         }
    }, []);

    const onChange = e => {
        const value = e.currentTarget.value;
        setValue(value);

        value ? props.sdk.field.setValue(value) : props.sdk.field.removeValue();
    };

    const onEditChange = () => {
        setEdit(edit ? !edit : true);
    };

    const CurrentDescription = () => {
        return (
            <Note noteType={boxColor} className={"myNote"}>
            <Markdown
                children={value}
                options={{
                    createElement(type, props, children) {
                        return (
                            <span className="parent">
                                {React.createElement(type, props, children)}
                            </span>
                        );
                    },
                }}
            />
            </Note>
        )
    };

    return (
        <>
            <div>
                {isEditor ? (
                            <Button className={"editButton"} onClick={onEditChange}>Edit</Button>) : null}
                {(edit && isEditor) ? (<Textarea
                        rows={8}
                        labelText={""}
                        id={"editArea"}
                        testId={"editArea-test"}
                        name={"editArea"}
                        value={value}
                        onChange={onChange}/>)
                    : (<div className={"descriptionBox"}><CurrentDescription
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

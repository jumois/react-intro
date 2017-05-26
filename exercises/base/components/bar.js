import React, {Component} from 'react';

export const TodoProgressBar = (props) => {
    // Calculate progress-bar width
    const p = Math.round(props.value / props.max * 100);
    const style = {
        width: `${p}%`
    };

    return (
        <div className='progress-container'>
            <div className='progress' style={style}>&nbsp;</div>
        </div>
    );
};

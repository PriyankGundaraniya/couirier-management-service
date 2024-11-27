import React from "react";

const ToastUI = () => {
    return (
        <div aria-live="polite" aria-atomic="true" className="position-relative">
            <div className="toast-container top-0 end-0 p-3">

                <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header">
                        <img src="..." className="rounded me-2" alt="..." />
                            <strong className="me-auto">Bootstrap</strong>
                            <small className="text-body-secondary">just now</small>
                            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div className="toast-body">
                        See? Just like this.
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ToastUI;
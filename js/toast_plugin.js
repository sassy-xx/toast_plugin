const toast_plugin = {
    _toast_queue_counter: 0,

    render_toast(type, title, message, time_to_show) {
        const {
            background_color,
            text_color,
            border_color,
            progress_bar_color
        } = this._get_toast_colors(type);

        const time_left = time_to_show;
        const queue_number = this._toast_queue_counter++;

        // Create the toast container if it doesn't exist
        this._create_toast_container();

        const toast_container = document.getElementById('toast_container');

        const toast_node = this._create_toast_node({
            queue_number,
            background_color,
            text_color,
            border_color,
            title,
            message,
            progress_bar_color
        });

        this._append_toast_node(toast_container, toast_node);
        this._show_toast(toast_node);
        this._start_toast_instance(queue_number, time_left, time_to_show, toast_node);
    },

    _create_toast_container() {
        const existing_container = document.getElementById('toast_container');

        if (!existing_container) {
            const toast_container = document.createElement('div');
            toast_container.id = 'toast_container';
            document.body.appendChild(toast_container);
        }
    },

    _get_toast_colors(type) {
        switch (type) {
            case 'success':
                return {
                    background_color: 'bg-success-subtle',
                    text_color: 'text-success',
                    border_color: 'border border-success',
                    progress_bar_color: 'bg-success'
                };
            case 'warning':
                return {
                    background_color: 'bg-warning-subtle',
                    text_color: 'text-warning',
                    border_color: 'border border-warning',
                    progress_bar_color: 'bg-warning'
                };
            case 'error':
                return {
                    background_color: 'bg-danger-subtle',
                    text_color: 'text-danger',
                    border_color: 'border border-danger',
                    progress_bar_color: 'bg-danger'
                };
            case 'information':
                return {
                    background_color: 'bg-info-subtle',
                    text_color: 'text-info',
                    border_color: 'border border-info',
                    progress_bar_color: 'bg-info'
                };
            default:
                return {};
        }
    },

    _create_toast_node({
        queue_number,
        background_color,
        text_color,
        border_color,
        title,
        message,
        progress_bar_color
    }) {
        const toast_node = document.createElement('div');
        toast_node.innerHTML = `
            <div class="container-fluid toast_instance ${background_color} ${text_color} ${border_color} m-0 p-0 g-0 mt-1 mb-1" id="toast_${queue_number}">
                <div class="row justify-content-center align-items-center g-0">
                    <div class="col-12">
                        <h6 class="${border_color} border-top-0 border-end-0 border-start-0 p-2">${title}</h6>
                    </div>
                </div>
                <div class="row justify-content-center align-items-center g-0">
                    <div class="col-12">
                        <p class="p-2">${message}</p>
                    </div>
                </div>
                <div id="progress_bar_${queue_number}" class="toast_progress_bar ${progress_bar_color}"></div>
            </div>
        `;
        return toast_node;
    },

    _append_toast_node(toast_container, toast_node) {
        toast_container.prepend(toast_node);
    },

    _show_toast(toast_node) {
        toast_node.classList.add('slide-in');
        toast_node.offsetWidth;
        toast_node.style.maxWidth = toast_node.offsetWidth + 'px';
        setTimeout(() => {
            toast_node.classList.add('show-toast');
        }, 10);
    },

    _start_toast_instance(queue_number, time_left, time_to_show, toast_node) {
        const intervalMs = 10;
        const totalIterations = time_to_show / intervalMs;

        const toast_instance = setInterval(() => {
            const progress_bar = document.getElementById(`progress_bar_${queue_number}`);
            time_left -= intervalMs;
            const percentage = (time_left / time_to_show) * 100;

            progress_bar.style.width = percentage + '%';
        }, intervalMs);

        setTimeout(() => {
            toast_node.classList.remove('show-toast');
            setTimeout(() => {
                toast_node.remove();
            }, 500);
            clearInterval(toast_instance);
        }, time_to_show);
    }
};

// Example usage:
// toast_plugin.render_toast('error', 'Username Empty', 'Please provide a valid username / Email address!', 5000);


// Example usage:
// possible types are:
// success
// warning
// info
// error
// ensure you have a div with ID of toast_container somewhere

// toast_plugin.render_toast(`error`, `A title`, `A useful message to the end user`, 10000); 10 second toast
// toast_plugin.render_toast(`success`, `A title`, `A useful message to the end user`, 5000); // 5 second toast

Template.flexboxLayout.events({
    'transitionend .sidebarMenu'(event, instance) {
        handleResize();
    },
    'transitionend .sidebar-option'(event, instance) {
        // Prevent this event from bubbling
        event.stopPropagation();
    }
});

Template.flexboxLayout.helpers({
    leftSidebarOpen() {
        return Template.instance().data.state.get('leftSidebar');
    },

    rightSidebarOpen() {
        return Template.instance().data.state.get('rightSidebar');
    }
});

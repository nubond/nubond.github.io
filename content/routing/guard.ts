constructor(router: Router) {
    router.onBeforeStateChange((prevent, oldState, newState) => {
        if (newState.page === 'admin' && !this.isAdmin) {
            prevent();
        }
    });
}

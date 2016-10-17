import {startAppLoop} from 'cx/app/startAppLoop';
import {createStore, ReduxStoreView} from 'cx-redux';
import Routes from './routes';
import {Widget} from 'cx/ui/Widget';
import {Debug} from 'cx/util/Debug';
import './index.scss';
import reducer from './reducers';

const store = new ReduxStoreView(createStore(reducer));

var stop;
if (module.hot) {
    // accept itself
    module.hot.accept();

    // remember data on dispose
    module.hot.dispose(function (data) {
        data.state = store.getData();
        if (stop)
            stop();
    });

    // apply data on hot replace
    if (module.hot.data)
        store.load(module.hot.data.state);
}

function updateHash() {
    store.set('hash', window.location.hash || '#')
}

updateHash();
setInterval(updateHash, 100);

Widget.resetCounter(); //preserve React keys
Debug.enable('app-data');

stop = startAppLoop(document.getElementById('app'), store, Routes);
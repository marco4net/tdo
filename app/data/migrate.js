import uid from 'uid';
import {cleanup} from './cleanup';

var migrations = [];

//add boards
migrations.push(function (data) {
    if (!Array.isArray(data.boards)) {
        data.boards = [{
            id: uid(),
            name: 'Tasks'
        }];
    }

    data.lists.forEach(l=> {
        if (!l.boardId)
            l.boardId = data.boards[0].id;
    });
});

//settings
migrations.push(function (data) {
    if (!data.settings)
        data.settings = {
            completedTasksRetentionDays: 1,
            deleteCompletedTasks: true,
            deleteCompletedTasksAfterDays: 7,
            purgeDeletedObjectsAfterDays: 3
        };
});

//created => createdDate
migrations.push(function (data) {
    var {boards, lists, tasks} = data;

    for (var array of [boards, lists, tasks]) {
        for (var b of array) {
            if (b.created) {
                b.createdDate = b.created;
                delete b.created;
            }
            if (b.isDeleted) {
                b.deleted = b.isDeleted;
                delete b.isDeleted;
            }
        }
    }
});


export function migrate(data) {
    var version = data.version || 0;

    for (var v = version; v < migrations.length; v++) {
        migrations[v](data);
        data.version = v;
    }

    cleanup(data);
}

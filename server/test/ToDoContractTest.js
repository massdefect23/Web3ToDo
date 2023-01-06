const {expect} = require("chai");
const {ethers} = require("hardhat");
describe("ToDo Contract", function() {
    let ToDoContract;
    let todoContract;
    let owner;

    const NUM_TOTAL_TASKS = 5;

    let totalTasks;

    this.beforeEach(async function() {
        ToDoContract = await ethers.getContractFactory("ToDoContract");
        [owner] = await ethers.getSigners();
        todoContract = await ToDoContract.deploy();

        totalTasks = [];

        for(let i=0; i<NUM_TOTAL_TASKS; i++) {
            let task = {
                'taskText': 'Task number:- ' + i,
                'isDeleted': false
            };

            await todoContract.addTask(task.taskText, task.isDeleted);
            totalTasks.push(task);
        }
    });

    describe("Add Task", function() {
        it("should emit AddTask event", async function() {
            let task = {
                'taskText': 'New Task',
                'isDeleted': false,
            };

            await expect(await todoContract.addTask(task.taskText, task.isDeleted)
            ).to.emit(todoContract, 'AddTask').withArgs(owner.address, NUM_TOTAL_TASKS);
        });
    });

    describe("Get All Tasks", function() {
        it("should return the correct number of total tasks", async function() {
            const todoFromChain = await todoContract.getTask();
            expect(todoFromChain.length).to.equal(NUM_TOTAL_TASKS);
        })
    })

    describe("Delete Task", function() {
        it("should emit delete task event", async function() {
            const TASK_ID = 0;
            const TASK_DELETED = true;

            await expect(
                todoContract.deleteTask(TASK_ID, TASK_DELETED)
            ).to.emit(
                todoContract, 'DeleteTask'
            ).withArgs(
                TASK_ID, TASK_DELETED
            );
        })
    })
});
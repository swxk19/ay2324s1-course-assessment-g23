import React from "react";

const UserTable = () => {
    return (
        <div className='app-container'>
            <h2>Users</h2>
                <table>
                    <thead>
                    <tr>
                        <th className='id-col'>ID</th>
                        <th className='title-col'>Name</th>
                        <th className='category-col'>Password</th>
                        <th className='complexity-col'>Email</th>
                    </tr>
                    </thead>
                </table>
        </div>

    )
}

export default UserTable;
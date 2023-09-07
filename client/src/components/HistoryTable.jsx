import Table from 'react-bootstrap/Table';
import dayjs from 'dayjs';

const HistoryTable = ({ history }) => {

    return (
        <div className='history-container d-flex flex-column justify-column-center pt-0 px-2'>
            {history.length ? (
                <>
                    <hr className='mb-2' />
                    <Table responsive="md">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th className='text-center'>Date</th>
                                <th className='text-center'>Difficulty</th>
                                <th className='text-center'>Item</th>
                                <th className='text-center'>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                history.map((row, index) => (
                                    <tr key={index}>
                                        <td>{index}</td>
                                        <td className='text-center'>{dayjs(row.date).format('D MMM YYYY')}</td>
                                        <td className='text-center'>{row.difficulty == 12 ? "Easy" : (row.difficulty == 24 ? "Medium" : "Hard")}</td>
                                        <td className='text-center'>{row.secretItem}</td>
                                        <td className='text-center'>{row.score}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </>) : <p className='text-center pt-4 mt-2'>You have no history,<br />play a match and then come back!</p>}
        </div>
    );
}

export { HistoryTable };
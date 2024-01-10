import "./widgetLg.css";

export default function WidgetLg() {
  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };
  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Latest transactions</h3>
      <table className="widgetLgTable">
        <tbody>
          <tr className="widgetLgTr">
            <th className="widgetLgTh">Customer</th>
            <th className="widgetLgTh">Date</th>
            <th className="widgetLgTh">Amount</th>
            <th className="widgetLgTh">Status</th>
          </tr>
          <tr className="widgetLgTr">
            <td className="widgetLgUser">
              <img src={"/images/anas.jpg"} alt="" className="widgetLgImg" />
              <span className="widgetLgName">Anas Haikal</span>
            </td>
            <td className="widgetLgDate">20 Jun 2023</td>
            <td className="widgetLgAmount">$300.00</td>
            <td className="widgetLgStatus">
              <Button type="Declined" />
            </td>
          </tr>
          <tr className="widgetLgTr">
            <td className="widgetLgUser">
              <img src={"/images/mtarsha.jpg"} alt="" className="widgetLgImg" />
              <span className="widgetLgName">Mo.Tarsha</span>
            </td>
            <td className="widgetLgDate">10 Jun 2023</td>
            <td className="widgetLgAmount">$220.00</td>
            <td className="widgetLgStatus">
              <Button type="Declined" />
            </td>
          </tr>
          <tr className="widgetLgTr">
            <td className="widgetLgUser">
              <img src={"/images/ibrahim.jpg"} alt="" className="widgetLgImg" />
              <span className="widgetLgName">Ibrahim Shuaib</span>
            </td>
            <td className="widgetLgDate">2 Jun 2023</td>
            <td className="widgetLgAmount">$80.00</td>
            <td className="widgetLgStatus">
              <Button type="Pending" />
            </td>
          </tr>
          <tr className="widgetLgTr">
            <td className="widgetLgUser">
              <img src={"/images/bilal.jpg"} alt="" className="widgetLgImg" />
              <span className="widgetLgName">Bilal Saad</span>
            </td>
            <td className="widgetLgDate">1 Jun 2023</td>
            <td className="widgetLgAmount">$52.00</td>
            <td className="widgetLgStatus">
              <Button type="Approved" />
            </td>
          </tr>
          <tr className="widgetLgTr">
            <td className="widgetLgUser">
              <img src={"/images/mahdi.jpg"} alt="" className="widgetLgImg" />
              <span className="widgetLgName">Mahdi Saleem</span>
            </td>
            <td className="widgetLgDate">5 April 2023</td>
            <td className="widgetLgAmount">$6.00</td>
            <td className="widgetLgStatus">
              <Button type="Approved" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

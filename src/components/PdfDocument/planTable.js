import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import moment from "moment";
import customStyles from "./styles";
import { formatMoney } from "helpers/format";
import { convertFrequencyToNumber } from "helpers/dateUtils";

const styles = StyleSheet.create(customStyles);

export default function PlanTable(props) {
  const { policies, planTitle } = props;
  let annualSum = 0;
  let monthlySum = 0;
  const totalPremiumText = `Total Premium for ${planTitle}`;

  return (
    <View style={{ padding: 20 }} wrap={false}>
      <View>
        <Text style={styles.title1}>{planTitle}</Text>
      </View>
      <View style={styles.tablelg}>
        <View style={styles.tableRowHeader}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Company</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Benefit</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Plan Name</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Policy No.</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Policy Date</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Cash Value</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Premium</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Annualised Premium</Text>
          </View>
        </View>
        {policies.map((item, key) => {
          const rowStyle = key % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd;

          if (item.paymentFrequency === "Annually") {
            annualSum += parseInt(item.premiumSGD)
              ? parseInt(item.premiumSGD)
              : 0;
          } else if (item.paymentFrequency === "Monthly") {
            monthlySum += parseInt(item.premiumSGD)
              ? parseInt(item.premiumSGD)
              : 0;
          }

          return (
            <View key={key} style={rowStyle}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {item.company ? item.company : "N/A"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{"N/A"}</Text>
                <Text style={styles.tableCellRemarks}>{item.remarks}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCellBold}>
                  {item.policyName ? item.policyName : "N/A"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {item.policyNumber ? item.policyNumber : "N/A"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {item.policyStartDate ? moment(item.policyStartDate).format(
                    "DD-MM-YYYY"
                  ) : "N/A"}
                </Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCell}>{"N/A"}</Text>
              </View>
              <View style={styles.tableColHeader}>
                <View style={styles.tableCell}>
                  <Text style={styles.lineInCell}>
                    {item.premiumSGD && item.premiumSGD > 0 ? `S$${formatMoney(item.premiumSGD)}` : ""}
                  </Text>
                  {item.paymentFrequency ?
                    <Text style={styles.lineInCell}>
                      {item.paymentFrequency}
                    </Text> : null}
                  {item.paymentMethod ?
                    <Text style={styles.lineInCell}>
                      {item.paymentMethod}
                    </Text> : null}
                </View>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCell}>
                  {item.paymentFrequency && item.premiumSGD && item.premiumSGD > 0 ?
                    `S$${formatMoney(item.premiumSGD * convertFrequencyToNumber(item.paymentFrequency))}` : ""}
                </Text>
              </View>
            </View>
          );
        })}
        {policies.length === 0 ? null : (
          <View style={styles.tableRowSum}>
            <View style={styles.tableColSumText}>
              <Text
                style={styles.tableCellSumText}
              >{totalPremiumText}</Text>
            </View>
            <View style={styles.tableColSum}>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellSum}>Annual</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellSum}>
                    {`S${formatMoney(annualSum)}`}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellSum}>Monthly</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellSum}>
                    {`S${formatMoney(monthlySum)}`}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
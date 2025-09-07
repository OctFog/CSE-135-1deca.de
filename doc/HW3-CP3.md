# Final Checkpoint

## Links
- [Dashboard](https://reporting.1deca.de/)
- [Detailed Report: Load Performance](https://reporting.1deca.de/load-performance.html)

## Team
Member: Xiaogeng Xu

## Dashboard

### **Performance Chart – Total Load Time per Session**

#### **What data is important?**
The key metric is **Page Load Time (ms)** per session. This shows how long users wait before the page is fully usable, which directly affects user experience, retention, and perceived website speed.

####  **How should that data be displayed?**
Load times should be displayed as a **line chart** with the X-axis representing the **date and time of each session** and the Y-axis representing **milliseconds**. This allows for quick identification of spikes, patterns, or improvements in performance over time.

#### **Does it make sense to use the chart?**
Yes. A line chart is a **good choice** because it shows **trends over time**, making it easy to observe whether performance is consistent, improving, or degrading.

---

### **Browser Usage – Pie Chart + Grid**

#### **What data is important?**
The key metric is **Browser Type** (e.g., Chrome, Safari, Firefox) and its **usage frequency**. Knowing which browsers are most popular ensures the website is tested and optimized for the majority of users.

#### **How should that data be displayed?**
A **pie chart** visually represents the **proportions of each browser**, while a **grid** shows the exact counts and percentages for more precise analysis.

#### **Does it make sense to use the chart and grid?**
Yes. A pie chart is a **good way** to show categorical data with proportions, making it easy to see the relative usage of each browser. The grid complements the chart by providing precise numbers, which helps in decision-making about which browsers to prioritize.

**Note on Browser Limitations:**
During testing, I found that Safari and Firefox do not support `window.navigator.connection.effectiveType`. As a result, the collector for network connection type sometimes fails with the error:

```
Error sending static data: TypeError: can't access property "effectiveType", window.navigator.connection is undefined
```

This limitation does not affect browser usage counts, but it can cause gaps in network connection data for those browsers.

---

### **Network Connection Type – Pie Chart + Grid**

#### **What data is important?**
The key metric is **Network Connection Type** (e.g., 4G, Wi-Fi) and the **number of sessions** for each type. This matters because different connection speeds directly affect page load times and user satisfaction.

#### **How should that data be displayed?**
A **pie chart** can display the **percentages of each connection type**, while a **grid** provides numeric counts for clarity and detailed reporting.

#### **Does it make sense to use the chart and grid?**
Yes. A pie chart is a **good way** to quickly see distribution proportions at a glance, and the grid allows for exact counts that are useful for detailed reporting and technical analysis.

---

### **User Activity Grid (Aggregated by Session)**

#### **What data is important?**
The key metrics are user interaction measures per session:

* **Mouse Time Spent (s)**
* **Click Time Spent (s)**
* **Scroll Time Spent (s)**
* **Key Events Count**
* **Idle Time (s)**

These help analyze engagement and interaction patterns.

#### **How should that data be displayed?**
A **grid** is the best choice because the data is tabular and numeric. Each row corresponds to a session, and each column shows a metric. Aggregating by session makes the data easier to read without overwhelming the viewer.

#### **Does it make sense to use the grid?**
Yes. Charts are better for showing trends or proportions, but when the goal is to examine **detailed numeric metrics**, a grid is the most practical and user-centered format.

## Report

### Metric Chosen
For the detailed report, I chose **Total Load Time per Session** as the primary metric. This metric directly reflects the user experience by showing how long it takes for the website to become fully usable for each visitor. The focus is on identifying sessions that experienced slower load times and exploring possible contributing factors such as browser type, network connection, and user activity.

### Chart Types and Rationale
1. **Grouped Bar Chart**  
   - **Data:** Load times per session categorized by browser.  
   - **Reasoning:** A grouped bar chart allows clear visual comparison of load times across different browsers and sessions. It helps quickly spot outliers and patterns that might indicate performance issues related to specific browsers.

2. **Grid (ZingGrid)**  
   - **Data:** Session-level details including Session ID, Access Time, Browser, Network Connection, Load Time, and Error Count.  
   - **Reasoning:** The grid provides precise numeric values for each session. This complements the chart by allowing users to cross-reference visual trends with exact data points, supporting deeper analysis and validation.

### Metrics Displayed and Why
- **Session ID:** To uniquely identify user sessions.  
- **Access Time:** Shows when the user accessed the website, useful for detecting trends over time.  
- **Load Time (ms):** The main metric indicating website performance.  
- **Browser:** Helps understand performance differences across browsers.  
- **Network Connection Type:** Important because users on slower connections may experience longer load times.  
- **Error Count:** Highlights potential issues affecting load time, such as failed resources or JavaScript errors.

### Design Decisions
- I prioritized **user-centered thinking** by selecting metrics that impact actual user experience.  
- Visualizations were chosen based on **data type**: categorical comparisons (browser) use bar charts, and session-level numeric data use a grid.  
- I ensured that the chart and grid **work together**, allowing both a quick visual summary and detailed numeric inspection.  
- Considered limitations such as missing network type for Safari and Firefox, coarse activity timing, and lack of server-side metrics. These limitations were noted so that analysis remains transparent and grounded in actual collected data.

### Insights
- The grouped bar chart quickly reveals which browsers or sessions experience higher load times.  
- The grid allows checking exact load times and error counts for each session, making it easy to investigate root causes.  
- This combination provides both **high-level trends** and **low-level details**, enabling more informed performance optimization decisions.
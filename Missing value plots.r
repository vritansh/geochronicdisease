library(dplyr)
library(tidyr)
library(tibble)
library(ggplot2)
library(tidyverse)

data = read.csv(file = 'CDC.csv') 

df <- data[data$YearStart %in% c('2018', '2019', '2020','2021'), ]

drop <- c("X")
df = df[,!(names(df) %in% drop)]

colSums(is.na(df)) %>%
  sort(decreasing = TRUE)

#Show only the head
rowSums(is.na(df)) %>%
  sort(decreasing = TRUE)

tidydf <- df %>% 
  rownames_to_column("id") %>% 
  gather(key, value, -id) %>% 
  mutate(missing = ifelse(is.na(value), "yes", "no"))

ggplot(tidydf, aes(x = key, y = id, fill = missing)) +
  geom_tile(color = "white") + 
  ggtitle("mtcars with NAs added") +
  scale_fill_viridis_d() + # discrete scale
  theme_bw()

levels <-
  (missing.values  %>% filter(isna == T) %>% arrange(desc(pct)))$key

percentage.plot <- missing.values %>%
  ggplot() +
  geom_bar(aes(x = reorder(key, desc(pct)), 
               y = pct, fill=isna), 
           stat = 'identity', alpha=0.8) +
  scale_x_discrete(limits = levels) +
  scale_fill_manual(name = "", 
                    values = c('steelblue', 'tomato3'), labels = c("Present", "Missing")) +
  coord_flip() +
  labs(title = "Percentage of missing values", x =
         'Variable', y = "% of missing values")

percentage.plot

dat2 <- read.csv("CDC.csv", header=T, na.strings=c("","NA"))
sapply(dat2, function(x) sum(is.na(x)))
df <- dat2[dat2$YearStart %in% c('2018', '2019', '2020','2021'), ]
missing.values <- df %>%
  gather(key = "key", value = "val") %>%
  mutate(is.missing = is.na(val)) %>%
  group_by(key, is.missing) %>%
  summarise(num.missing = n()) %>%
  filter(is.missing==T) %>%
  select(-is.missing) %>%
  arrange(desc(num.missing)) 

ggplot() + geom_bar(data = missing.values, aes(x=key, y=num.missing), stat = 'identity')+labs(x='variable', y="number of missing values", title='Number of missing values') + theme(axis.text.x = element_text(angle = 45, hjust = 1)) + coord_cartesian(ylim=c(0,100000)) + scale_y_continuous(breaks=seq(0,100000,12500))

library(redav)
plot_missing(dat2, percent = FALSE)

df  %>%  summarise_all(list(~is.na(.)))
df  %>%
  +     summarise_all(list(~is.na(.)))%>%
  +     pivot_longer(everything(),
                     +                  names_to = "variables", values_to="missing")

df  %>%
  +     summarise_all(list(~is.na(.)))%>%
  +     pivot_longer(everything(),
                     +                  names_to = "variables", values_to="missing") %>%
  +     count(variables, missing)

df  %>%
  +     summarise_all(list(~is.na(.)))%>%
  +     pivot_longer(everything(),
                     +                  names_to = "variables", values_to="missing") %>%
  +     count(variables, missing) %>%
  +     ggplot(aes(y=variables,x=n,fill=missing))+
  +     geom_col()

